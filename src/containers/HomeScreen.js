import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  View,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import BackgroundImageComponent from '../components/BackgroundImageComponent';
import commonStyle from '../resource/styles/commonStyles';
import ImageLogoComponent from '../components/ImageLogoComponent';
import {Strings} from '../resource/Strings';
import ButtonCustomComponent from '../components/ButtonCustomComponent';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../constants/colors';
import ProgressiveImage from '../components/ProgressiveImage';
import CommonRequest from '../repositories/remote/request/CommonRequest';
import {
  checkingMobile,
  getChecking,
  upLoadAvatar,
} from '../repositories/service/userService';
import {userLoginSelector} from '../selectors/userSelector';
import common from '../utils/common';
import ModalDatePickerComponent from '../components/ModalDatePickerComponent';
import constant from '../constants/constant';
import ImageRotate from 'react-native-image-rotate';

import {getLocation} from '../actions/locationAction';
import InputDataCustom from '../components/InputDateCustom';

function HomeScreen({navigation}) {
  const userLoginTor = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [listCheckInOut, setListCheckInOut] = useState([]);
  const [checkLoadEndData, setCheckLoadEndData] = useState(true);
  const [showModalDatePicker, setShowModalDatePicker] = useState(false);
  const [dateSearch, setDateSearch] = useState('');
  useEffect(() => {
    getListCheckInOut(1);
  }, [dateSearch]);

  const getListCheckInOut = (currentPage, isLoading = true) => {
    const request = new CommonRequest();
    request.addParam('code', userLoginTor?.code ?? '');
    request.addParam('curent_page', currentPage);
    request.addParam('page_size', 15);
    request.addParam(
      'fromDateTime',
      dateSearch ? common.formatDateShow(dateSearch) : '',
    );
    request.addParam('toDateTime', common.getDateNow());
    getChecking(
      request,
      res => {
        if (res?.success === 1) {
          if (res?.data?.length >= 15) {
            setCheckLoadEndData(true);
          } else {
            setCheckLoadEndData(false);
          }

          if (res?.curent_page === 1) {
            setListCheckInOut(res?.data);
          } else {
            setListCheckInOut([...listCheckInOut, ...res?.data]);
          }
        }
      },
      isLoading,
    );
  };

  const handleUploadImage = (result, typeChecking, imageShow) => {
    const thumbnailRequest = new CommonRequest();
    thumbnailRequest.addParam('img_num', 1);
    thumbnailRequest.addParam('img0', result);
    upLoadAvatar(thumbnailRequest, res => {
      if (res?.message === 'unknown') {
        common.showAlertOneChoice('Nhận dạng khuôn mặt không khớp');
      }
      if (res?.success === 1 && res?.code === userLoginTor.code) {
        dispatch(
          getLocation({
            onSuccess: onSuccess => {
              const commonRequest = new CommonRequest();
              commonRequest.addParam('code', res?.code);
              commonRequest.addParam('latitude', onSuccess?.latitude);
              commonRequest.addParam('longitude', onSuccess?.longitude);
              commonRequest.addParam('type', typeChecking);
              commonRequest.addParam('face_img', imageShow);
              checkingMobile(commonRequest, resChecking => {
                if (typeChecking === 'in') {
                  if (
                    resChecking?.success === 1 &&
                    resChecking?.have_trans_on_day === 0
                  ) {
                    common.showAlertOneChoice('Chấm công thành công');
                    getListCheckInOut(1, true);
                  } else if (
                    resChecking?.success === 1 &&
                    resChecking?.have_trans_on_day === 1
                  ) {
                    common.showAlertOneChoice('Bạn đã chấm công rồi');
                  } else {
                    common.showAlertOneChoice('Chấm công thất bại');
                  }
                } else {
                  if (resChecking?.success === 1) {
                    common.showAlertOneChoice('Check out thành công');
                    getListCheckInOut(1, true);
                  } else {
                    common.showAlertOneChoice('Check out thất bại');
                  }
                }
              });
            },
            onFailed: onFailed => {
              common.showAlertOneChoice('Không lấy đươc vị trí hiện tại');
            },
          }),
        );
      }
    });
  };

  const openCamera = typeChecking => {
    common.pickImageFromCamera(
      result => {
        let newImages = {};
        if (Platform.OS === 'android') {
          let imageShow = {
            uri: result?.path,
            name: common.getFileName(result),
            type: result?.mime,
          };
          ImageRotate.rotateImage(
            result.path,
            90,
            uri => {
              newImages = {
                uri: uri,
                name: common.getFileName(result),
                type: result?.mime,
              };
              handleUploadImage(newImages, typeChecking, imageShow);
            },
            err => {
              console.log(err, 'err');
            },
          );
        } else {
          newImages = {
            uri: result?.path,
            name: common.getFileName(result),
            type: result?.mime,
          };
          handleUploadImage(newImages, typeChecking, newImages);
        }
      },
      () => {},
    );
  };

  const HeaderList = () => {
    return (
      <View style={stylesLoginStart.itemHeader}>
        <Text
          style={[
            commonStyle.textAlignCenter,
            stylesLoginStart.textDate,
            {flex: 0.1},
          ]}>
          #
        </Text>
        <Text
          style={[
            commonStyle.textAlignCenter,
            stylesLoginStart.textDate,
            {flex: 1.5},
          ]}>
          Thời gian
        </Text>
        <Text
          style={[
            commonStyle.flex1,
            commonStyle.textAlignCenter,
            stylesLoginStart.textDate,
          ]}>
          Ảnh
        </Text>
        <Text
          style={[
            commonStyle.flex1,
            commonStyle.textAlignCenter,
            stylesLoginStart.textDate,
          ]}>
          Trạng thái
        </Text>
      </View>
    );
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    getListCheckInOut(page + 1);
  };

  const onRefresh = () => {
    setPage(1);
    getListCheckInOut(1);
  };

  const renderItem = (item, index) => {
    return (
      <View style={stylesLoginStart.item}>
        <Text
          style={[
            commonStyle.textAlignCenter,
            stylesLoginStart.textDate,
            {flex: 0.2},
          ]}>
          {index + 1}
        </Text>
        <View
          style={[
            commonStyle.justifyAndAlignCenter,
            {flex: 1.5, alignSelf: 'center'},
          ]}>
         
          <Text style={stylesLoginStart.textDate}>
            {common.splitDate(item?.checking)[1]}
          </Text>
        </View>
        <View style={commonStyle.flex1}>
          <ProgressiveImage
            thumbnailStyle={commonStyle.fullWeightHeight}
            source={
              item?.image_64_encode
                ? {uri: `data:image/jpeg;base64,${item.image_64_encode}`}
                : null
            }
            style={{width: '100%', height: 80}}
            containerStyle={commonStyle.fullWeightHeight}
          />
        </View>
        <Text
          style={[
            commonStyle.flex1,
            commonStyle.textAlignCenter,
            stylesLoginStart.textDate,
          ]}>
          {item?.state=='in'?'vào' :"ra"}
        </Text>
      </View>
    );
  };

  return (
    <BackgroundImageComponent>
      <SafeAreaView
        style={[
          commonStyle.justifyAndAlignCenter,
          stylesLoginStart.container,
          commonStyle.containerNoHeader,
        ]}>
        <ImageLogoComponent
          content={userLoginTor?.name ?? ''}
          customImageLogo={{height: constant.HEIGHT / 5}}
          isShowHello={true}
        />
        {/* <ButtonCustomComponent
          label={Strings.chooseDate}
          customStyle={stylesLoginStart.buttonCustom}
          customStyleText={{color: colors.lightNavy}}
          onPress={() => setShowModalDatePicker(true)}
        /> */}
        <InputDataCustom onchangeText={(value) => setDateSearch(value) } dateSearch={dateSearch} textData={dateSearch}/>
        {/* <Text numberOfLines={1} style={stylesLoginStart.textNote}>
          Bạn đã chọn {dateSearch ? common.formatDateShow(dateSearch) : ''}
        </Text> */}
        {HeaderList()}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listCheckInOut}
          style={commonStyle.width100}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => renderItem(item, index)}
          ListEmptyComponent={() => (
            <Text style={{alignSelf: 'center', marginTop: 30}}>
              {Strings.noData}
            </Text>
          )}
          onEndReached={() => {
            checkLoadEndData ? handleLoadMore() : null;
          }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        />
        <View
          style={[
            commonStyle.justifyAndAlignContentBetween,
            {flexDirection: 'row', width: '100%'},
          ]}>
          <ButtonCustomComponent
            label={'Check In'}
            customStyle={stylesLoginStart.btnLogout}
            customStyleText={{color: colors.lightNavy}}
            onPress={() => {
              openCamera('in');
            }}
          />
          <ButtonCustomComponent
            label={'Check Out'}
            customStyle={stylesLoginStart.btnLogout}
            customStyleText={{color: colors.lightNavy}}
            onPress={() => {
              openCamera('out');
            }}
          />
        </View>
      </SafeAreaView>
    </BackgroundImageComponent>
  );
}

const stylesLoginStart = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  textNote: {
    paddingVertical: 14,
    fontSize: 16,
  },
  textDate: {
    paddingVertical: 2,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    alignItems: 'center',
    marginBottom: 5,
  },
  itemHeader: {
    width: '100%',
    flexDirection: 'row',
    // backgroundColor :'red',
    // alignItems: 'center',
    height: 50,
  },
  buttonCustom: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    marginTop: 2,
    width: 'auto',
  },
  btnLogout: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    width: '40%',
    marginBottom: Platform.OS === 'ios' ? 8 : 12,
  },
});

export default HomeScreen;
