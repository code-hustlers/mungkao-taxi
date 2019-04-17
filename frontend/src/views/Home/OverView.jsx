import React from "react";

const OverView = props => {
  try {
    const { userInfo, fcmTest } = props;

    return (
      <div>
        <span style={{ color: "#8e44ad" }}>{userInfo.id}</span>
        <span>님, 어서오세요.</span>
        <button onClick={fcmTest}>FCM Test</button>
      </div>
    );
  } catch {
    return <div>Catch</div>;
  }
};

export default OverView;
