import React from 'react';
import Button from "../../components/Button";
import { CardForm } from "../../components/Card/CardForm";
import styled, { keyframes } from 'styled-components';

const Title = styled.div`
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
`;

const Div = styled.div`
  border: 2px solid #eee;
  padding: 0 3rem;
  &:hover {
    background: black;
    color: #fff;
  };
  ${props => props.userID === props.id ?
    `background: black;
    color: #fff;`
  : null}
`;

const swing = keyframes`
    20% { transform: rotate(15deg); right: 0%; }
    40% { transform: rotate(-10deg); right: 20%; }
    60% { transform: rotate(5deg); right: 40%; }
    80% { transform: rotate(-5deg); right: 60%; }
    100% { transform: rotate(0deg); right: 100% }
`;

const passengerSwing = keyframes`
    0% { transform: rotate(5deg); right: 0%; }
    20% { transform: rotate(5deg); right: 0%; }
    40% { transform: rotate(-5deg); right: 20%; }
    60% { transform: rotate(10deg); right: 40%; }
    80% { transform: rotate(-10deg) right: 20%; }
    100% { transform: rotate(0deg); right: 0%; }
`;

const Swing = styled.div`
    position: fixed;
    animation: ${props => props.type === 'driver' ? swing : passengerSwing} 2s linear infinite;
`;

const Drive = (props) => {
    const { userInfo, userID, drivers, calls, handleSelectUser, handleClick, handleReject, isPassengerHome, isDriverHome } = props;
    console.log({isPassengerHome}, {isDriverHome});

    const driverElem = drivers.map(el => {
        return(el.status === 0 ?
          <CardForm key={el.id} >
            <Div onClick={handleSelectUser(el.id)} userID={userID} id={el.id}>
              <h2>{el.id}</h2>
              <span>{el.name}</span>
              <span>{el.date}</span><br/>
            </Div>
          </CardForm>
          : null);
      });

      const callElem = calls.map((el, idx) => {
        if(el.sPoint === '') {
          el.sPoint = '여기서부터 ';
        }
        if(el.destination === '') {
          el.destination = '저기까지';
        }
        return (
          <CardForm key={idx}>
            <Div onClick={handleSelectUser(el.userId)} userID={userID} id={el.userId}>
              <h2>{el.userId}</h2>
              <p>{`${el.sPoint} ~ ${el.destination}`}</p>
              <p>{el.price <= 0 ? '꽁짜' : el.price}</p>
              <p>{el.date}</p>
            </Div>
          </CardForm>
        )
      });

    return(!isPassengerHome && !isDriverHome ?
        <div>
            {!userInfo.position || userInfo.position === 0 ? (
              <div>
                <Title>마음에 드는 운전자를 선택하세요:D</Title>
                {driverElem}
                <CardForm>
                  <Button onClick={handleClick}>
                    call
                  </Button>
                </CardForm>
              </div>
              ) : (
              <div>
                <Title>당신이 요청받은 콜 리스트 입니다:D</Title>
                {callElem}
                <Button onClick={handleClick} style={{width:'45%', margin:'auto 2.5%'}}>
                  Ok
                </Button>
                <Button onClick={handleReject} style={{width:'45%', margin:'auto 2.5%'}}>
                  No
                </Button>
              </div>
            )}
        </div>
        :
        <div>
          {!userInfo.position || userInfo.position === 0 ? (
            <Swing type="driver">
              <img src="/mungCar.png" alt="멍카" />
            </Swing>
            ) : (
            <Swing type="passenger">
              <img src="/qvil.png" alt="태수" />
            </Swing>
          )}
        </div>
    );
}

export default Drive;