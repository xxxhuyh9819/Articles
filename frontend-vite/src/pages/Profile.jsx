import { Card, message } from "antd";
import { useEffect } from "react";
import "../styles/Profile.css";
import {
  followAPI,
  getUserInfoByNameAPI,
  unfollowAPI,
} from "../apis/otherUser";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserDeleteOutlined,
  UserAddOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setLoginCredentials } from "../store/modules/user";
import { useLocalStorage } from "../hooks";
const Profile = () => {
  const navigate = useNavigate();
  const [visitedUser, setVisitedUser] = useLocalStorage("visited_user", {});
  const { username } = useParams();
  const { userInfo } = useSelector((state) => state.user);
  //   const { articleList } = useSelector((state) => state.article);
  const dispatch = useDispatch();

  // the accounts that the logged in user is following
  let currentUserFollowingSet = new Set(userInfo.accounts_following);

  // accounts that are following the visited account
  let latest_follower =
    visitedUser.latest_follower && visitedUser.latest_follower.length !== 0
      ? visitedUser.latest_follower[0]
      : {};

  useEffect(() => {
    getVisitedUserInfo();
  }, [username]);

  function getVisitedUserInfo() {
    getUserInfoByNameAPI(username)
      .then((result) => {
        if (result.status === 200) {
          setVisitedUser(result.data);
        }
      })
      .catch((error) => {
        message.warning("Error: ", error);
      });
  }

  const handleFollow = async (followee_id) => {
    if (userInfo.user_token === undefined || userInfo.user_token === null) {
      alert("You're not authorized!");
      navigate("/login");
      return;
    }
    let form = {
      user_token: userInfo.user_token,
      follower_id: Number(userInfo.user_id),
      followee_id: followee_id,
    };
    if (currentUserFollowingSet.has(followee_id)) {
      currentUserFollowingSet.delete(followee_id);
      dispatch(
        setLoginCredentials({
          ...userInfo,
          accounts_following: [...currentUserFollowingSet],
        })
      );
      if (followee_id === visitedUser.id) {
        setVisitedUser({
          ...visitedUser,
          num_of_followers: visitedUser.num_of_followers - 1,
        });
      }
      const result = await unfollowAPI(form);
      if (result.status === 200) {
        message.info(result.data);
      } else {
        message.warning("failed!");
      }
    } else {
      currentUserFollowingSet.add(followee_id);
      dispatch(
        setLoginCredentials({
          ...userInfo,
          accounts_following: [...currentUserFollowingSet],
        })
      );
      if (followee_id === visitedUser.id) {
        setVisitedUser({
          ...visitedUser,
          num_of_followers: visitedUser.num_of_followers + 1,
        });
      }
      const result = await followAPI(form);
      if (result.status === 200) {
        message.info(result.data);
      } else {
        message.warning("failed!");
      }
    }
  };

  return (
    <div className="profile">
      <Card className="profile-card">
        <div className="profile-info">
          <section>
            <h1>{visitedUser.name}</h1>
            {userInfo.user_name !== visitedUser.name ? (
              <i onClick={() => handleFollow(visitedUser.id)}>
                {currentUserFollowingSet.has(visitedUser.id) ? (
                  <UserDeleteOutlined
                    style={{
                      color: "red",
                      fontSize: "2rem",
                    }}
                  />
                ) : (
                  <UserAddOutlined
                    style={{
                      color: "#1f1e33",
                      fontSize: "2rem",
                    }}
                  />
                )}
              </i>
            ) : (
              <i onClick={() => navigate("/myProfile")}>
                <FormOutlined
                  style={{
                    color: "#1f1e33",
                    fontSize: "2rem",
                  }}
                />
              </i>
            )}
          </section>

          <span>
            {visitedUser.user_bio
              ? visitedUser.user_bio
              : `${visitedUser.name} is mysterious with no bio written...`}
          </span>
        </div>
        <div className="container">
          <Card className="user-info-section">
            <div className="info-container">
              <h3>Articles Published</h3>
              <h1>{visitedUser.num_of_articles}</h1>
            </div>
          </Card>

          <Card className="user-info-section">
            <div className="info-container">
              <h3>Followers</h3>
              <h1>{visitedUser.num_of_followers}</h1>
              {visitedUser.num_of_followers > 0 && (
                <>
                  <div className="latest-follower">
                    <p>{visitedUser.name}&apos;s latest follower</p>
                    <div
                      className="followee"
                      onClick={() =>
                        navigate(`/profile/${latest_follower.follower_name}`)
                      }
                    >
                      {JSON.stringify(latest_follower) !== "{}" && (
                        <section>
                          <i>
                            <UserOutlined />
                          </i>
                          <h3>{latest_follower.follower_name}</h3>
                        </section>
                      )}
                      {latest_follower.user_id !== Number(userInfo.user_id) && (
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow(latest_follower.user_id);
                          }}
                        >
                          {new Set(userInfo.accounts_following).has(
                            latest_follower.user_id
                          ) ? (
                            <UserDeleteOutlined style={{ color: "red" }} />
                          ) : (
                            <UserAddOutlined style={{ color: "#1f1e33" }} />
                          )}
                        </i>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="user-info-section" id="follow-section">
            <h3>Following...</h3>
            {visitedUser.accounts_following !== undefined &&
              visitedUser.accounts_following !== null && (
                <ul>
                  {visitedUser.accounts_following.map((account, index) => {
                    return (
                      <li
                        key={index}
                        className="followee"
                        onClick={() =>
                          navigate(`/profile/${account.followee_name}`)
                        }
                      >
                        <section>
                          <i>
                            <UserOutlined />
                          </i>
                          <h3>{account.followee_name}</h3>
                        </section>
                        {account.user_id !== Number(userInfo.user_id) && (
                          <i
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollow(account.user_id);
                            }}
                          >
                            {new Set(userInfo.accounts_following).has(
                              account.user_id
                            ) ? (
                              <UserDeleteOutlined style={{ color: "red" }} />
                            ) : (
                              <UserAddOutlined style={{ color: "#1f1e33" }} />
                            )}
                          </i>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
          </Card>
        </div>
        {/*<div className="user-articles">*/}
        {/*    <h2>{username}'s articles</h2>*/}
        {/*    <ul>*/}
        {/*        {filteredArticles.map((article, index) => {*/}
        {/*            return <li key={index}>*/}
        {/*                <div>{article.create_date}</div>*/}
        {/*                <div>{article.author}</div>*/}
        {/*            </li>*/}
        {/*        })}*/}
        {/*    </ul>*/}
        {/*</div>*/}
      </Card>
    </div>
  );
};

export default Profile;
