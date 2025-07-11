interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: {
    id: string;
    path: string;
  } | null;
  role?: {
    id: string | number;
    name?: string;
  };
}

type Participant = User;

interface Conversation {
  id: string;
  name?: string;
  participants: Participant[];
  lastMessageAt: string;
}

export const getUserDisplayName = (user: User | null | undefined, fallback = 'User'): string => {
  if (!user) return fallback;

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } else if (user.firstName) {
    return user.firstName;
  } else if (user.lastName) {
    return user.lastName;
  } else {
    return user.email || fallback;
  }
};

export const getUserInitials = (user: User): string => {
  const displayName = getUserDisplayName(user);
  return displayName.charAt(0).toUpperCase();
};

export const getConversationDisplayName = (
  conversation: Conversation,
  currentUserId?: string
): string => {
  const participantCount = conversation.participants?.length || 0;
  
  // For group conversations (3+ people), show conversation name or "Group Chat"
  if (participantCount >= 3) {
    if (conversation.name && conversation.name.trim()) {
      return conversation.name;
    }
    return 'Group Chat';
  }

  // For 1-on-1 conversations (2 people), show the other person's name
  if (participantCount === 2) {
    // Find the other participant (not the current user)
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    
    if (otherParticipant) {
      return getUserDisplayName(otherParticipant);
    }
    
    // Fallback for 1-on-1 conversations without sufficient data
    return 'Direct Message';
  }

  // Single participant or empty conversation
  return 'Chat';
};

export const getConversationAvatar = (
  conversation: Conversation,
  currentUserId?: string
): string => {
  if (conversation.participants && conversation.participants.length > 0) {
    const otherParticipants = conversation.participants.filter(
      (p: Participant) => p.id !== currentUserId
    );

    if (otherParticipants.length === 1) {
      return getUserInitials(otherParticipants[0]);
    } else if (otherParticipants.length > 1) {
      return otherParticipants.length.toString();
    }
  }
  return '?';
};

export const getConversationSubtitle = (
  conversation: Conversation,
  currentUserId?: string
): string => {
  const participantCount = conversation.participants?.length || 0;
  const otherParticipants =
    conversation.participants?.filter((p: Participant) => p.id !== currentUserId) || [];

  if (otherParticipants.length === 1) {
    const participant = otherParticipants[0];
    return participant.role?.name === 'admin' ? 'Admin' : 'Team Member';
  } else if (otherParticipants.length > 1) {
    return `${otherParticipants.length} members`;
  }

  return `${participantCount} participant${participantCount !== 1 ? 's' : ''}`;
};

export const shouldShowMessageSender = (
  currentMessage: { senderId?: { id: string } },
  previousMessage: { senderId?: { id: string } } | null,
  isOwnMessage: boolean
): boolean => {
  // System messages don't show senders
  if (!currentMessage.senderId) return false;

  return (
    !isOwnMessage &&
    (!previousMessage ||
      !previousMessage.senderId ||
      previousMessage.senderId.id !== currentMessage.senderId.id)
  );
};

export const isLastMessageInGroup = (
  currentMessage: { senderId?: { id: string } },
  nextMessage: { senderId?: { id: string } } | null
): boolean => {
  // System messages are always their own group
  if (!currentMessage.senderId) return true;

  return (
    !nextMessage ||
    !nextMessage.senderId ||
    nextMessage.senderId.id !== currentMessage.senderId.id
  );
};

export const isFirstMessageInGroup = (
  currentMessage: { senderId?: { id: string } },
  previousMessage: { senderId?: { id: string } } | null
): boolean => {
  // System messages are always their own group
  if (!currentMessage.senderId) return true;

  return (
    !previousMessage ||
    !previousMessage.senderId ||
    previousMessage.senderId.id !== currentMessage.senderId.id
  );
};

export const getConversationPrimaryParticipant = (
  conversation: Conversation,
  currentUserId?: string
): User | null => {
  // Find the other participant (not the current user)
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
  
  if (otherParticipant) {
    return otherParticipant;
  }

  // Return null if no suitable participant data available
  // UserDisplay component will show a generic avatar
  return null;
};

/**
 * Get short display name (first name or first part of email)
 */
export const getUserShortName = (user: User | null | undefined, fallback = 'User'): string => {
  if (!user) return fallback;

  if (user.firstName) {
    return user.firstName;
  }

  if (user.lastName) {
    return user.lastName;
  }

  // Get first part of email
  if (user.email) {
    const emailParts = user.email.split('@');
    return emailParts[0] || fallback;
  }

  return fallback;
};

/**
 * Get welcome message for user
 */
export const getWelcomeMessage = (
  user: User | null | undefined,
  customMessage?: string
): string => {
  if (customMessage) return customMessage;

  const name = getUserShortName(user);
  return `Welcome back, ${name}!`;
};

/**
 * Check if user has a complete profile
 */
export const hasCompleteProfile = (user: User | null | undefined): boolean => {
  if (!user) return false;

  return !!(user.firstName && user.lastName && user.email);
};