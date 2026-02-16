import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../../shared/data-access/supabase-service';

export const plantaOwnerGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const supabaseClient = inject(SupabaseService).supabaseClient;

  const plantaId = route.paramMap.get('id');
  if (!plantaId) {
    router.navigateByUrl('/plantas');
    return false;
  }

  const { data: userData, error: userError } = await supabaseClient.auth.getUser();

  if (userError || !userData.user) {
    router.navigateByUrl('/auth/log-in');
    return false;
  }

  const { data: plantaData, error: plantaError } = await supabaseClient
    .from('plantas')
    .select('user_id')
    .eq('id', plantaId)
    .single();

  if (plantaError || !plantaData) {
    router.navigateByUrl('/plantas');
    return false;
  }

  if (plantaData.user_id !== userData.user.id) {
    router.navigateByUrl(`/plantas/${plantaId}`);
    return false;
  }

  return true;
};
