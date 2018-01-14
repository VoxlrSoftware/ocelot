export const SORT_ORDER_ASC = 'ASC';
export const SORT_ORDER_DESC = 'DESC';

export const CALL_STRATEGY_SUMMARY = 'callStrategy';
export const CUSTOMER_TALK_RATIO_SUMMARY = 'customerTalkRatio';
export const CONVERSATION_RATIO_SUMMARY = 'conversationRatio';
export const CALL_OUTCOME_SUMMARY = 'callOutcome';


export const VOXLR_PHONE = '+19193360458';
export const DEBUG_MODE = process.env.NODE_ENV === 'development';
export const RECORDING_URL = 'CHANGE_THIS';
export const VOXLR_URL = 'CHANGE_THIS';
export const MARMOSET_URL = 'http://localhost:8080';

export const CALL_OUTCOMES = {
  LOST: 'Lost',
  PROGRESS: 'Progress Made',
  VOICEMAIL: 'Voicemail/Left message',
  WON: 'Won',
};

export const CONVERSATION_OUTCOMES = [
  CALL_OUTCOMES.LOST,
  CALL_OUTCOMES.PROGRESS,
  CALL_OUTCOMES.WON,
];
