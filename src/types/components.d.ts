interface DialogAction {
  text: string;
  onClick: () => void;
  color?: 'primary' | 'error' | 'secondary' | 'inherit';
}
