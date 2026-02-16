
-- Drop all existing restrictive policies on attendance
DROP POLICY IF EXISTS "Authenticated can view all attendance" ON public.attendance;
DROP POLICY IF EXISTS "Super admins can manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can insert own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can update own attendance" ON public.attendance;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Authenticated can view all attendance"
ON public.attendance FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can insert own attendance"
ON public.attendance FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own attendance"
ON public.attendance FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage attendance"
ON public.attendance FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role));
