export const openHoldPopupConfig = {
  type: 'openHoldPopup',
  eventSource: 'click',
};

export const addNoteActionsPopupConfig = (value) => ({
  title: 'Add Note',
  items: [
    {
      ctype: 'textarea',
      name: 'addNote',
      textareaClass: 'note-class',
      uuid: 'addNoteUUID',
      required: true,
      value,
    },
  ],
  footer: [
    {
      ctype: 'button',
      color: 'primary',
      text: 'Cancel',
      uuid: 'cancelHoldUUID',
      closeType: 'close',
      disableClose: true,
      visibility: true,
      dialogButton: true,
      type: '',
      hooks: [],
      validations: [],
      actions: [],
    },
    {
      ctype: 'button',
      color: 'primary',
      text: 'Done',
      uuid: 'doneaddnoteUUID',
      dialogButton: true,
      visibility: true,
      disabled: !value,
      type: 'submit',
      closeType: 'success',
      hooks: [],
      validations: [],
      actions: [],
    },
  ],
});
