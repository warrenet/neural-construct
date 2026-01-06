-- Enable the Vector extension for AI Memory
create extension if not exists vector;

-- 1. CHATS TABLE
create table public.chats (
  id text primary key, -- matching local IDB string IDs
  user_id uuid references auth.users not null,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);
alter table public.chats enable row level security;

create policy "Users can CRUD their own chats"
  on public.chats for all
  using (auth.uid() = user_id);

-- 2. MESSAGES TABLE
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id text references public.chats(id) on delete cascade,
  user_id uuid references auth.users not null,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;

create policy "Users can CRUD their own messages"
  on public.messages for all
  using (auth.uid() = user_id);

-- 3. MEMORY VECTOR STORE (The "Deep Memory")
create table public.memories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,       -- The text chunk
  source text,                 -- filename or origin
  embedding vector(1536),      -- OpenAI/gte-small compatible dimensions
  created_at timestamptz default now()
);
alter table public.memories enable row level security;

create policy "Users can CRUD their own memories"
  on public.memories for all
  using (auth.uid() = user_id);

-- 4. SEARCH FUNCTION (RPC)
-- This allows the app to find similar memories securely
create or replace function match_memories (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  source text,
  similarity float
)
language plpgsql
stable
as $$
begin
  return query
  select
    memories.id,
    memories.content,
    memories.source,
    1 - (memories.embedding <=> query_embedding) as similarity
  from memories
  where 1 - (memories.embedding <=> query_embedding) > match_threshold
  and memories.user_id = auth.uid() -- Secure: only search own memories
  order by memories.embedding <=> query_embedding
  limit match_count;
end;
$$;
