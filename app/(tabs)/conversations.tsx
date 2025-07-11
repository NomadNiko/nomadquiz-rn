import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConversations } from '../../contexts/ConversationsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
// ThemeToggle removed from this component
import ConversationScreen from '../../screens/ConversationScreen';
import NewConversationModal from '../../components/NewConversationModal';
import ConversationCard from '../../components/messaging/ConversationCard';
import LoadingStateContainer from '../../components/ui/LoadingStateContainer';
import { useMessagingStyles } from '../../hooks/useMessagingStyles';
import { Conversation } from '../../types/messaging';
import { TEXT_STYLES } from '../../theme/fonts';
import IconButton from '../../components/ui/IconButton';
import WelcomeHeader from '../../components/ui/WelcomeHeader';

export default function ConversationsTab() {
  const { user } = useAuth();
  const { conversations, isLoading, error, refreshData, selectConversation } = useConversations();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  const { colors, isDark } = useMessagingStyles();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleConversationPress = (conversation: Conversation) => {
    selectConversation(conversation);
    setSelectedConversationId(conversation.id);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  const handleNewConversation = () => {
    setShowNewConversationModal(true);
  };

  const handleConversationCreated = (conversation: Conversation) => {
    // Refresh the conversations list to show the new conversation
    refreshData();
    // Optionally, navigate to the new conversation
    selectConversation(conversation);
    setSelectedConversationId(conversation.id);
  };

  // Show individual conversation if one is selected
  if (selectedConversationId) {
    return <ConversationScreen conversationId={selectedConversationId} onBack={handleBackToList} />;
  }

  if (error) {
    return (
      <View className="flex-1 rounded-t" style={{ backgroundColor: colors.background }}>
        {/* Fixed Header */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}>
          <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center justify-between px-6 pb-4">
              <View>
                <Text
                  className="font-bold text-2xl"
                  style={{ color: colors.foreground, ...TEXT_STYLES.bold }}>
                  Messages
                </Text>
                <Text className="text-sm" style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                  Welcome back, {user?.firstName || user?.email}!
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View
          className="mx-4 flex-1 items-center justify-center rounded p-6"
          style={{
            marginTop: 160,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.20)',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            overflow: 'hidden',
            position: 'relative',
          }}>
          {/* Gloss overlay */}
          <LinearGradient
            colors={
              isDark
                ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)', 'transparent']
                : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent']
            }
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60%',
              borderRadius: 16,
              opacity: 0.8,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          {/* Lens effect */}
          <View
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              right: 2,
              bottom: 2,
              borderRadius: 14,
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
              opacity: 0.3,
            }}
          />
          {/* Content */}
          <View style={{ position: 'relative', zIndex: 10, alignItems: 'center' }}>
            <View className="rounded p-6" style={{ backgroundColor: colors.destructive + '20' }}>
              <Ionicons name="alert-circle" size={48} color={colors.destructive} />
            </View>
            <Text
              className="mt-6 px-4 text-center font-semibold text-lg"
              style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}>
              {error}
            </Text>
            <TouchableOpacity
              className="mt-6 rounded px-8 py-4"
              style={{ backgroundColor: colors.primary }}
              onPress={onRefresh}>
              <Text style={{ ...TEXT_STYLES.semibold, color: 'white' }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 rounded-t" style={{ backgroundColor: colors.background }}>
        {/* Fixed Header */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}>
          <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center justify-between px-6 pb-4">
              <WelcomeHeader title="Messages" user={user} />
              <IconButton
                onPress={handleNewConversation}
                iconName="add"
                iconSize={20}
                variant="rounded"
                size="medium"
              />
            </View>
          </SafeAreaView>
        </View>

        <ScrollView
          className="flex-1 rounded-t"
          contentContainerStyle={{ paddingTop: 120, paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {/* Conversations List */}
          {conversations.length > 0 ? (
            <View className="px-4 pt-4">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  currentUserId={user?.id}
                  onPress={handleConversationPress}
                  isDark={isDark}
                />
              ))}
            </View>
          ) : !isLoading ? (
            <View
              className="mx-4 flex-1 items-center justify-center rounded p-6"
              style={{
                borderRadius: 16,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.20)',
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
                borderWidth: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                overflow: 'hidden',
                position: 'relative',
              }}>
              {/* Gloss overlay */}
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)', 'transparent']
                    : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent']
                }
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  borderRadius: 16,
                  opacity: 0.8,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              {/* Lens effect */}
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  right: 2,
                  bottom: 2,
                  borderRadius: 14,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                  opacity: 0.3,
                }}
              />
              {/* Content */}
              <View style={{ position: 'relative', zIndex: 10, alignItems: 'center' }}>
                <View className="rounded p-6" style={{ backgroundColor: colors.grey5 }}>
                  <Ionicons name="chatbubbles-outline" size={64} color={colors.grey2} />
                </View>
                <Text
                  className="mt-6 text-center font-semibold text-lg"
                  style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}>
                  No Conversations Yet
                </Text>
                <Text
                  className="mt-2 px-4 text-center"
                  style={{ color: colors.grey2, ...TEXT_STYLES.regular }}>
                  Start a conversation with your team members to see them here.
                </Text>
                <TouchableOpacity
                  className="mt-6 rounded px-8 py-4"
                  style={{ backgroundColor: colors.primary }}
                  onPress={handleNewConversation}>
                  <Text style={{ ...TEXT_STYLES.semibold, color: 'white' }}>
                    Start Conversation
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* New Conversation Modal */}
        <NewConversationModal
          visible={showNewConversationModal}
          onClose={() => setShowNewConversationModal(false)}
          onConversationCreated={handleConversationCreated}
        />
      </View>

      {/* Full Screen Loading Overlay */}
      <LoadingStateContainer
        isLoading={isLoading && conversations.length === 0}
        size={100}
        color={colors.primary}
        fullScreen
      />
    </>
  );
}
