import Immutable from 'immutable';

const ADMIN_ROLES = Immutable.Set.of(
  'SUPER_ADMIN',
  'ADMIN',
  'COMPANY_ADMIN',
);

export const isAdminAccount = (user) => {
  const role = user && user.get('role');
  return role && ADMIN_ROLES.contains(role);
};
