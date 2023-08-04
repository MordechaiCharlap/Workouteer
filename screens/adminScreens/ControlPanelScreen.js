import { View, Text, ScrollView } from "react-native";
import React, { useCallback } from "react";
import useAuth from "../../hooks/useAuth";
import useNavbarDisplay from "../../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomText from "../../components/basic/CustomText";
import languageService from "../../services/languageService";
import * as appStyle from "../../utils/appStyleSheet";
import Header from "../../components/Header";
import CustomButton from "../../components/basic/CustomButton";
import useResponsiveness from "../../hooks/useResponsiveness";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBug,
  faFile,
  faToiletPaper,
} from "@fortawesome/free-solid-svg-icons";
import { safeAreaStyle } from "../../components/safeAreaStyle";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import useFirebase from "../../hooks/useFirebase";

const ControlPanelScreen = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  const { windowHeight } = useResponsiveness();
  const { db } = useFirebase();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("AdminHome");
    }, [])
  );
  const resetAllAppData = async () => {
    var collec, q, snap;
    collec = collection(db, "alerts");
    q = query(collec);
    snap = await getDocs(q);
    snap.forEach((doc) => {
      if (doc.role != "admin") deleteDoc(doc);
      else updateDoc(doc, { defaultCity: null });
    });
  };
  const testButtonFunction = () => {
    getDoc(doc(db, "test", "testGeoPoint")).then((doc) => {
      console.log(doc.data().testLocation);
    });
  };
  const rowStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
  };
  const menuContainerStyle = {
    alignSelf: "center",
    width: "85%",
    height: "80%",
    justifyContent: "space-between",
  };
  const AdminButton = (props) => {
    const iconSize = windowHeight / 16.5;
    const buttonStyle = {
      backgroundColor: appStyle.color_surface_variant,
      height: windowHeight / 5.5,
    };
    const textStyle = { fontSize: windowHeight / 35, textAlign: "center" };
    return (
      <CustomButton
        style={buttonStyle}
        onPress={() => {
          navigation.navigate(props.navigate);
        }}
      >
        <CustomText style={textStyle}>{props.title}</CustomText>

        <FontAwesomeIcon
          icon={props.icon}
          size={iconSize}
          color={appStyle.color_on_surface_variant}
        />
      </CustomButton>
    );
  };
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].controlPanel}
        goBackOption={true}
      />
      <ScrollView>
        <View style={{ rowGap: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
          <AdminButton
            navigate="SuggestionsAndBugs"
            icon={faBug}
            title={languageService[user.language].suggestionsAndBugs}
          />
          {/* <AdminButton
            icon={faToiletPaper}
            title={languageService[user.language].resetAppData}
          /> */}
          {/* <AdminButton
            icon={faFile}
            title={"Reports"}
            navigate={"WorkoutPrograms"}
          /> */}
          <AdminButton
            icon={faFile}
            title={"Testing Screen"}
            navigate={"Test"}
          />
          {/* <AdminButton
            icon={faFile}
            title={"All Users"}
            navigate={"WorkoutPrograms"}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default ControlPanelScreen;
