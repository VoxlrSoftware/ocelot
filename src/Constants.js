export const SORT_ORDER_ASC = 'ASC';
export const SORT_ORDER_DESC = 'DESC';

export const DETECTION_RATIO_SUMMARY = 'detectionRatio';
export const CALL_STRATEGY_SUMMARY = 'callStrategy';
export const CUSTOMER_TALK_RATIO_SUMMARY = 'customerTalkRatio';
export const CONVERSATION_RATIO_SUMMARY = 'conversationRatio';
export const CALL_OUTCOME_SUMMARY = 'callOutcome';


export const VOXLR_PHONE = '+19193360458';
export const DEBUG_MODE = process.env.NODE_ENV === 'development';
export const RECORDING_URL = 'http://localhost:5000';
export const VOXLR_URL = 'http://localhost:8080';
export const MARMOSET_URL = 'http://localhost:8080';

export const CALL_OUTCOMES = {
  LOST: { text: 'Lost', value: 'Lost' },
  PROGRESS: { text: 'Progress', value: 'Progress Made' },
  VOICEMAIL: { text: 'Voicemail/Left message', value: 'Voicemail' },
  WON: { text: 'Won', value: 'Won' },
};

export const CONVERSATION_OUTCOMES = [
  CALL_OUTCOMES.LOST,
  CALL_OUTCOMES.PROGRESS,
  CALL_OUTCOMES.WON,
];
