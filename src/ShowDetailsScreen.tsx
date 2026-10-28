import React from 'react';
import {Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootStackParamList} from '../App';
import {SHOWS, colors} from './data';

export function ShowDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ShowDetails'>>();
  const show = SHOWS.find(s => s.id === route.params.showId);

  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
        <Text style={styles.back}>‹ Back</Text>
      </Pressable>
      <Text style={styles.title}>{show?.headliner ?? 'Show'}</Text>
      <Text style={styles.meta}>
        {show?.venue} · {show?.seatsLeft} seats left
      </Text>
      <Text style={styles.body}>
        Doors open one hour before showtime. Two-drink minimum. No hecklers,
        we know where you sit.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg, padding: 16},
  back: {color: colors.accent, fontSize: 16, marginBottom: 16},
  title: {color: colors.text, fontSize: 26, fontWeight: '700'},
  meta: {color: colors.muted, fontSize: 15, marginTop: 8},
  body: {color: colors.text, fontSize: 16, lineHeight: 24, marginTop: 24},
});
