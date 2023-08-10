import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/basic/CustomButton";
import CustomText from "../../components/basic/CustomText";
import { color_on_primary, color_primary } from "../../utils/appStyleSheet";
import useFirebase from "../../hooks/useFirebase";
import { doc, updateDoc } from "firebase/firestore";
import CustomModal from "../../components/basic/CustomModal";
const TestScreen = () => {
  const { db } = useFirebase();
  const [showModal, setShowModal] = useState(false);
  const testButtonFunction = () => {};
  return (
    <View className="flex-1">
      <CustomButton
        style={{ backgroundColor: color_primary }}
        onPress={() => setShowModal((prev) => !prev)}
      >
        <CustomText style={{ color: color_on_primary }}>TestButton</CustomText>
      </CustomButton>
      <CustomModal
        closeOnTouchOutside
        showModal={showModal}
        setShowModal={setShowModal}
        style={{}}
      >
        <CustomText>Test</CustomText>
      </CustomModal>
    </View>
  );
};

export default TestScreen;
