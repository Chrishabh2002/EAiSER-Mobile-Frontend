import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const features = [
    { icon: 'chatbubbles', title: 'AI Chat', description: 'Chat with our intelligent AI assistant' },
    { icon: 'document-text', title: 'Documents', description: 'Analyze and summarize documents' },
    { icon: 'image', title: 'Image Analysis', description: 'Get insights from your images' },
    { icon: 'code-slash', title: 'Code Help', description: 'Get coding assistance and explanations' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>Good Day!</Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            How can I help you today?
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.chatCard, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/chat')}
        >
          <Ionicons name="sparkles" size={32} color="#FFFFFF" />
          <Text style={styles.chatCardTitle}>Start a Conversation</Text>
          <Text style={styles.chatCardSubtitle}>
            Ask anything, get instant answers
          </Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={feature.icon as any} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
  },
  chatCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  chatCardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  chatCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
});