import styled from "styled-components";

export const WorkImageWrapper = styled.section`
  padding: 60px 5% 30px;
  font-family: "Open Sans", sans-serif;

  div.heading {
    h2 {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
    }
    p {
      margin: 10px 0 25px;
      text-align: center;
      font-size: 15px;
    }
  }
  .MuiButtonBase-root {
    margin: 0 auto;
    display: flex;
  }
`;

export const WorkImageListWrapper = styled.section`
  width: 100%;
  max-width: 1440px;
  margin: 20px auto;
  & > ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    & > li {
      width: 22%;
      min-width: 200px;
      margin: 15px auto;
      background-color: #f5f5f5;
      box-shadow: 0 0 5px 1px #888;
      border-radius: 4px;
    }
  }

  div.detail {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 0.5rem 5px;
    font-family: "Open Sans", sans-serif;

    h6 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 14px;
      opacity: 0.8;

      span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      svg {
        font-size: 18px;
        opacity: 0.9;

        &:hover {
          opacity: 0.5;
        }
      }
    }
  }

  div.tags {
    margin: 5px 0;
    font-size: 13px;
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  figure {
    width: 100%;
    height: 200px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: 400ms ease;
    }
  }

  ul.priority-time {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    opacity: 0.6;
  }

  @media only screen and (max-width: 426px) {
    figure {
      height: 100px;
    }

    div.detail {
      padding-top: 6px;

      h6 {
        font-size: 12px;
      }
    }

    div.tags {
      font-size: 12px;
    }

    ul.priority-time {
      font-size: 10px;
    }
  }
`;
