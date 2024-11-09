type User = {
  uid: string;
  username: string;
  profilePicture: string;
};

interface UserContextType {
  user: User | undefined;
  loading: boolean;
}
