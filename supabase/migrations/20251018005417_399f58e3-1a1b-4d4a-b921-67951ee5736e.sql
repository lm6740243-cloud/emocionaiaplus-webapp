-- Add missing triggers for tables
DROP TRIGGER IF EXISTS update_user_achievements_updated_at ON public.user_achievements;
CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_groups_updated_at ON public.support_groups;
CREATE TRIGGER update_support_groups_updated_at
  BEFORE UPDATE ON public.support_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS handle_new_group_trigger ON public.support_groups;
CREATE TRIGGER handle_new_group_trigger
  BEFORE INSERT ON public.support_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_group();

DROP TRIGGER IF EXISTS add_group_owner_trigger ON public.support_groups;
CREATE TRIGGER add_group_owner_trigger
  AFTER INSERT ON public.support_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.add_group_owner_as_member();

DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
CREATE TRIGGER handle_new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();