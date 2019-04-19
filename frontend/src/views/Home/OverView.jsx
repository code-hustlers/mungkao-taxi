import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const DownIcon = styled.img.attrs({src: '/expand.png'})`
    position: absolute;
    top: 90%;
    width: 1rem;
    height: 1rem;
`;

const OverView = (props) => {
    const { userInfo, fcmTest } = props;

    return(
        <Div>
            <span style={{ color: "#8e44ad" }}>{userInfo.id} <span style={{color:'#555'}}>님, 어서오세요.</span></span>
            <button onClick={fcmTest}>FCM Test</button>
            <a href="#drive">
                <DownIcon />
            </a>
        </Div>
    );
}

export default OverView;