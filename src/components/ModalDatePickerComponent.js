import React from 'react';
import moment from 'moment';
import {
  Dimensions,
  Modal,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../constants/colors';
import common from '../utils/common';
import alerts from '../constants/alerts';

const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;
const ModalDatePickerComponent = ({
  showModalDatePicker,
  setShowModalDatePicker,
  setDateChange,
  valueDate,
}) => {
  // eslint-disable-next-line no-unused-vars
  let dateSelectedIOS;
  const maxDate = moment().subtract(18, 'years');

  function renderHeaderIOSDatepicker() {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.headerIOSDatePicker}>
          <TouchableOpacity
            style={{height: '100%', justifyContent: 'center'}}
            onPress={() => {
              setShowModalDatePicker(false);
            }}>
            <Text style={styles.confirmText}>{alerts.cancelButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{height: '100%', justifyContent: 'center'}}
            onPress={() => {
              setShowModalDatePicker(false);
              if (dateSelectedIOS) {
                setDateChange(dateSelectedIOS);
              } else {
                setDateChange(common.formatDateSearch(new Date()));
              }
            }}>
            <Text style={styles.confirmText}>完了</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = common.formatDateSearch(selectedDate);
    if (isCancelButtonAndroid(event)) {
      setShowModalDatePicker(false);
    } else if (isOKButtonAndroid(event)) {
      setShowModalDatePicker(false);
      setDateChange(currentDate);
    } else {
      //For iOS changeDate
      dateSelectedIOS = currentDate;
    }
  };

  function isCancelButtonAndroid(event) {
    return Platform.OS === 'android' && event.type === 'dismissed';
  }

  function isOKButtonAndroid(event) {
    return Platform.OS === 'android' && event.type === 'set';
  }

  function renderIOS() {
    return (
      <Modal
        visible={showModalDatePicker}
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => {
          setShowModalDatePicker(false);
        }}>
        <View style={styles.container}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopEndRadius: 12,
              borderTopStartRadius: 12,
            }}>
            <View>
              {renderHeaderIOSDatepicker()}
              <DateTimePicker
                value={valueDate !== '' ? new Date(valueDate) : new Date()}
                maximumDate={new Date()}
                mode={'date'}
                display="spinner"
                locale="vi"
                onChange={onChange}
                style={{backgroundColor: colors.white}}
                themeVariant="light"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function renderDatePickerAndroid() {
    if (showModalDatePicker) {
      return (
        <DateTimePicker
          value={valueDate !== '' ? new Date(valueDate) : new Date()}
          maximumDate={new Date()}
          mode={'date'}
          display="spinner"
          onChange={onChange}
          locale="vi"
          style={{backgroundColor: colors.white}}
          themeVariant="light"
        />
      );
    } else {
      return null;
    }
  }

  return (
    <View>
      {Platform.OS === 'ios' ? renderIOS() : renderDatePickerAndroid()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Width,
    alignSelf: 'flex-end',
    height: Height,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dateTimePicker: {
    height: Height * 0.3,
    backgroundColor: colors.white,
  },
  confirmText: {color: colors.white, fontWeight: 'bold'},
  headerIOSDatePicker: {
    height: 40,
    backgroundColor: colors.textHeader,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
});

export default ModalDatePickerComponent;
