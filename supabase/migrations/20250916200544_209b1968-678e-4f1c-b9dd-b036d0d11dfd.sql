-- Allow buyers to delete their own interests
CREATE POLICY "Buyers can delete their interests"
ON public.buyer_interests
FOR DELETE
TO authenticated
USING (buyer_id = auth.uid());