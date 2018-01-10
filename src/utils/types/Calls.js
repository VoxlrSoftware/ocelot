export const calculateConversationRatio = (data) => {
  if (!data) {
    return undefined;
  }

  return data.get('conversations') / data.get('calls');
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return '';
  }

  const formattedNumber = phoneNumber.replace(/\D\d/g, '');
  const components = formattedNumber.match(/^(\d{3})(\d{3})(\d{4})$/);

  return (!components) ? '' : `(${components[1]}) ${components[2]}-${components[3]}`;
};

export const getPhoneNumber = (state) => {
  return state && state.get('phoneNumber');
};
