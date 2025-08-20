import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://aljpanvmlkcprnzrxnjc.supabase.co';
const supabaseKey = 'sb_publishable_lv-AmScJPFgjNqW4qQpD7w_E348CvUS';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };