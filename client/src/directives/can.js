import { useUserStore } from '@/stores/user'

const evaluateAccess = (el, binding) => {
  if (!binding.value) {
    el.style.display = 'none';
    return;
  }

  const { role, ownerId } = binding.value;
  const user = useUserStore().user;
  
  let hasAccess = false;

  if (!user || (!user.loggedIn && !user.ID)) {
    el.style.display = 'none';
    return;
  }

  if (role) {
    hasAccess = Array.isArray(role) 
      ? role.includes(user.role) 
      : user.role === role;
  }

  if (!hasAccess && ownerId) {
    hasAccess = user.ID === ownerId;
  }

  if (!hasAccess) {
    el.style.display = 'none';
  } else {
    el.style.display = ''; 
  }
};

export const canDirective = {
  mounted: evaluateAccess,
  updated: evaluateAccess
};