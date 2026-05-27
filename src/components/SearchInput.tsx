import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { Input, Text } from 'components/base';
import { IcSearch, IcFilter } from 'assets/svgs';
import { scale } from 'utils';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  suggestions?: Array<{ id: string; name: string; [key: string]: any }>;
  onSuggestionSelect?: (suggestion: any) => void;
  maxSuggestions?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
  onFilterPress,
  suggestions = [],
  onSuggestionSelect,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (value.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter(
        (item) =>
          item.name?.toLowerCase().includes(value.toLowerCase()) ||
          item.id?.toString().includes(value),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [value, suggestions]);

  const handleSuggestionSelect = (suggestion: any) => {
    onChangeText(suggestion.name || suggestion.id);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (value.trim() && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <View style={styles.container}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        Icon={<IcSearch />}
        iconRight={onFilterPress ? <IcFilter /> : undefined}
        onIconRightPress={onFilterPress}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        containerStyle={styles.inputContainer}
      />

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={`${suggestion.id}-${index}`}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionSelect(suggestion)}
                activeOpacity={0.7}
              >
                <Text fontSize={scale(12)} color="$gray800">
                  {suggestion.name || suggestion.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    zIndex: 1001,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: scale(8),
    borderWidth: 1,
    // borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: scale(200),
    zIndex: 1000,
    marginTop: scale(2),
  },
  suggestionsList: {
    maxHeight: scale(200),
  },
  suggestionItem: {
    paddingVertical: scale(10),
    paddingLeft: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});

export default SearchInput;
