import { useNavigate } from 'react-router-dom';

import CustomDialog from './CustomDialog';

import { useUserStore } from '@/stores';

interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const RoleSelectionModal = ({ open, onClose }: RoleSelectionModalProps) => {
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  return (
    // Role Selection Dialog
    <CustomDialog
      open={open}
      onClose={onClose}
      title='Select Role'
      description='Please select your role to proceed.'
      actions={[
        {
          text: 'Donor',
          onClick: async () => {
            await login('donor', navigate);
            onClose();
          },
        },
        {
          text: 'Organization',
          onClick: async () => {
            await login('organization', navigate);
            onClose();
          },
        },
      ]}
    />
  );
};

export default RoleSelectionModal;
