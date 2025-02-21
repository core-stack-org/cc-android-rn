import { Alert, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getQueryParams } from '../helper/utils';
import { Dropdown } from 'react-native-element-dropdown';
import * as constant from '../helper/constants';
import syncStorage from 'sync-storage';

const LocationSelection = ({ navigation }) => {
  const [statevalue, setStateValue] = useState(null);
  const [distvalue, setDistValue] = useState(null);
  const [blockvalue, setBlockValue] = useState(null);
  const [blockId, setBlockId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colorScheme = useColorScheme(); // Get the current color scheme

  const [planValue, setPlanValue] = useState(null);
  const [isFocusPlan, setIsFocusPlan] = useState(false);
  const [planData, setPlanData] = useState(null);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 16,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdown: {
      height: 50,
      width: 250,
      borderColor: '#d6d5c9',
      borderWidth: 2,
      borderRadius: 20,
      marginBottom: 20,
      paddingHorizontal: 12,
      color: '#592941',
    },
    dropdownContainer: {
      backgroundColor: '#fff',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dropdownOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdownItemContainer: (isLastItem) => ({
      paddingVertical: 0,
      paddingHorizontal: 20,
      borderBottomWidth: isLastItem ? 0 : 1,
      borderBottomColor: isLastItem ? 'transparent' : '#ccc',
    }),
    text: {
      fontSize: 16,
      color: '#592941',
      marginBottom: 16,
    },
    centerview: {
      width: '60%',
      marginBottom: 16,
    },
    submitButton: {
      backgroundColor: '#d6d5c9',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#592941',
      fontSize: 16,
      fontWeight: '400',
      textAlign: 'center',
    },
    selectedItemContainer: {
      backgroundColor: '#d6d5c9',
      borderRadius: 20,
    },
    selectedItemText: {
      color: '#592941',
    },
  });

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(constant.api_url + 'proposed_blocks/');
        if (response.ok) {
          const jsonData = await response.json();
          // Validate data structure
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            setData(jsonData);
          } else {
            setError('Invalid data format received from server');
          }
        } else {
          setError('Failed to fetch location data');
        }
      } catch (error) {
        console.error('Error fetching location data from the server API:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  const getDistrict = (statevalue, flag) => {
    if (!statevalue) {
      return [];
    }
    const selectedState = data.find((item) => item.label === statevalue);
    if (!selectedState) {
      return [];
    }
    if (flag === 'block') {
      const blocklist = selectedState.district.reduce((acc, district) => {
        if (district.blocks && district.label === distvalue) {
          acc.push(...district.blocks);
        }
        return acc;
      }, []);
      return blocklist || [];
    }
    return selectedState.district || [];
  };

  const handleSubmit = () => {
    if (distvalue && blockvalue) {
      console.log('statevalue:', statevalue);
      console.log('distvalue:', distvalue);
      console.log('blockvalue:', blockvalue);
      console.log('blockId:', blockId);

      // Set values in syncStorage
      syncStorage.set('geoserver_url', constant.geoserver_url);
      syncStorage.set('dist_name', distvalue);
      syncStorage.set('block_name', blockvalue);
      syncStorage.set('block_id', blockId);

      navigation.navigate('Maps', {
        geoserver_url: constant.geoserver_url,
        dist_name: distvalue,
        block_name: blockvalue,
        block_id: blockId,
      });
    } else {
      Alert.alert('Error', 'Please select a district and a block before submitting.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading locations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: 'red' }]}>{error}</Text>
      </View>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No location data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholderStyle={{ color: '#592941' }}
        itemTextStyle={{ color: '#592941' }}
        placeholder={statevalue || 'Select state'}
        value={statevalue !== null ? statevalue : null}
        onChange={(item) => {
          setStateValue(item.label);
          setDistValue(null);
          setBlockValue(null);
        }}
        containerStyle={styles.dropdownContainer}
        overlay={styles.dropdownOverlay}
        itemContainerStyle={(index) =>
          styles.dropdownItemContainer(index === data.length - 1)
        }
        selectedItemContainerStyle={styles.selectedItemContainer}
        selectedItemTextStyle={styles.selectedItemText}
      />

      {statevalue && (
        <Dropdown
          style={styles.dropdown}
          data={getDistrict(statevalue, 'dist')}
          labelField="label"
          valueField="value"
          placeholderStyle={{ color: '#592941' }}
          itemTextStyle={{ color: '#592941' }}
          placeholder={distvalue || 'Select district'}
          value={distvalue}
          onChange={(item) => {
            setDistValue(item.label);
            setBlockValue(null);
          }}
          containerStyle={styles.dropdownContainer}
          overlay={styles.dropdownOverlay}
          itemContainerStyle={(index) =>
            styles.dropdownItemContainer(
              index === getDistrict(statevalue, 'dist').length - 1
            )
          }
          selectedItemContainerStyle={styles.selectedItemContainer}
          selectedItemTextStyle={styles.selectedItemText}
        />
      )}

      {distvalue && (
        <Dropdown
          style={styles.dropdown}
          data={getDistrict(statevalue, 'block')}
          labelField="label"
          valueField="block_id"
          placeholderStyle={{ color: '#592941' }}
          itemTextStyle={{ color: '#592941' }}
          placeholder={blockvalue || 'Select block'}
          value={blockvalue}
          onChange={(item) => {
            setBlockValue(item.label);
            setBlockId(item.block_id);
          }}
          containerStyle={styles.dropdownContainer}
          overlay={styles.dropdownOverlay}
          itemContainerStyle={(index) =>
            styles.dropdownItemContainer(
              index === getDistrict(statevalue, 'block').length - 1
            )
          }
          selectedItemContainerStyle={styles.selectedItemContainer}
          selectedItemTextStyle={styles.selectedItemText}
        />
      )}

      {planData && (
        <Dropdown
          style={styles.dropdown}
          data={planData.Items[0].Plans.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          labelField="label"
          valueField="value"
          placeholder={spellingMapping[planValue] || 'Select plan'}
          value={planValue}
          onChange={(item) => {
            const correctedPlan = Object.keys(spellingMapping).find(
              (key) => spellingMapping[key] === item
            );
            setPlanValue(correctedPlan || item);
            setIsFocusPlan(false);
          }}
          containerStyle={styles.dropdownContainer}
          overlay={styles.dropdownOverlay}
          itemContainerStyle={(index) =>
            styles.dropdownItemContainer(
              index === planData.Items[0].Plans.length - 1
            )
          }
          selectedItemContainerStyle={styles.selectedItemContainer}
          selectedItemTextStyle={styles.selectedItemText}
        />
      )}

      <View style={styles.centerview}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationSelection;