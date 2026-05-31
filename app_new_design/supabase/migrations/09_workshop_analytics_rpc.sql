-- Create RPC function to safely increment analytics columns
CREATE OR REPLACE FUNCTION increment_service_stat(
  row_id UUID,
  col_name TEXT
) RETURNS VOID AS $$
BEGIN
  IF col_name = 'views_count' THEN
    UPDATE public.services SET views_count = views_count + 1 WHERE id = row_id;
  ELSIF col_name = 'whatsapp_clicks' THEN
    UPDATE public.services SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = row_id;
  ELSIF col_name = 'shares_count' THEN
    UPDATE public.services SET shares_count = shares_count + 1 WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
