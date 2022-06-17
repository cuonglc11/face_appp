import React, { useState } from "react";
import { Text, Image, TextInput, View, TouchableOpacity } from 'react-native'
import constant from "../constants/constant";
import ModalDatePickerComponent from "./ModalDatePickerComponent";
const InputDataCustom = ({ onchangeText, dateSearch, textData }) => {
    const [showModalDatePicker, setShowModalDatePicker] = useState(false);

    return (
        <View style={{padding : 12}}>
            <View
                style={{
                    backgroundColor:'white',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    borderColor: '#000',
                    padding : 10,
                    borderRadius: 10,
                    borderWidth: 0.6,
                }}
            >
                <Text style={{
                    flex: 1,
                    alignSelf: 'flex-start',
                }}>
                    {textData ? textData : "Mời bạn chọn ngày"}
                </Text>
                <TouchableOpacity
                    onPress={() => setShowModalDatePicker(true)}
                >
                    <Image source={constant.icon_date} style={{
                        width: 12, height: 12
                    }} />

                </TouchableOpacity>
            </View>
            <ModalDatePickerComponent
                setShowModalDatePicker={setShowModalDatePicker}
                showModalDatePicker={showModalDatePicker}
                valueDate={dateSearch}
                setDateChange={onchangeText}
            />

        </View>
    )
}
export default InputDataCustom