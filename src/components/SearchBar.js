import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchCities } from '../services/weatherApi';

export default function SearchBar({ onSelectCity }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = useCallback(async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    try {
      const cities = await searchCities(text);
      setResults(cities);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSelect = useCallback(
    (city) => {
      onSelectCity(city.lat, city.lon);
      setQuery('');
      setResults([]);
      setShowResults(false);
      Keyboard.dismiss();
    },
    [onSelectCity]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        )}
      </View>

      {showResults && results.length > 0 && (
        <View style={styles.resultsList}>
          {results.map((city, index) => (
            <TouchableOpacity
              key={`${city.lat}-${city.lon}-${index}`}
              style={styles.resultItem}
              onPress={() => handleSelect(city)}
            >
              <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.resultText}>
                {city.name}
                {city.state ? `, ${city.state}` : ''}, {city.country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showResults && results.length === 0 && !searching && query.length >= 2 && (
        <View style={styles.resultsList}>
          <Text style={styles.noResults}>No cities found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 8,
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  clearButton: {
    padding: 4,
  },
  resultsList: {
    marginTop: 6,
    backgroundColor: 'rgba(30,40,60,0.95)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  resultText: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 10,
  },
  noResults: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
