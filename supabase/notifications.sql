-- Create notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policy: Users can see their own notifications
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

-- Policy: System/Admin/Organizers can insert (via server functions usually, but we'll allow authenticated for now to simplify triggering)
create policy "Authenticated can insert notifications"
  on public.notifications for insert
  with check (auth.role() = 'authenticated');
