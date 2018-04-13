export const FIELDS = {
  CONVERSATION: 'conversation',
  CUSTOMER_TALK_RATIO: 'detectionRatio',
  DETECTION_RATIO: 'customerTalkRatio',
  TOTAL_COUNT: 'totalCount',
};

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

  let number = phoneNumber;
  let extension = '';

  if (typeof phoneNumber === 'object') {
    ({ number, extension } = phoneNumber);
  }

  if (extension) {
    extension = `x${extension}`;
  }

  const formattedNumber = number.replace(/\D\d/g, '');
  const components = formattedNumber.match(/^(\d{3})(\d{3})(\d{4})$/);

  return (!components) ? '' : `(${components[1]}) ${components[2]}-${components[3]}${extension}`;
};

export const getPhoneNumber = (state) => {
  return state && state.get('phoneNumber') && state.get('phoneNumber').get('number');
};

