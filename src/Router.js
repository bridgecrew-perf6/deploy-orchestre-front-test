import React from 'react';
import { Route, BrowserRouter, Routes, Navigate, useParams } from 'react-router-dom';
import LoginPage from './pages/User/LoginPage';
import NotFoundPage from './pages/General/NotFoundPage';
import NewProfilePage from './pages/User/NewProfilePage';
import jwt_decode from "jwt-decode";
import { getInitializedProfileCurrentUser, getMyRights } from './GraphQL/queries/UserQueries';
import ProfileCompletedPage from './pages/User/ProfileCompleted';
import EventPage from './pages/Event/EventPage';
import BoardPage from './pages/Board/BoardPage';
import EventPageGestion from './pages/Event/EventPageGestion';
import EventDetailsPage from "./pages/Event/EventDetailsPage";
import MyAccountPage from "./pages/User/MyAccountPage";
import AddEventPage from "./pages/Event/AddEventPage";
import ConstructionPage from './pages/General/ConstructionPage';
import { rightIsInRole } from './Helpers/RightsGestion';
import App from './App';
import CommunicationPage from './pages/Administration/CommunicationPage';
import MembersAdministrationPage from './pages/Administration/MembersAdministrationPage';
import AddMemberPage from './pages/Administration/AddMemberPage';
import MailValidationPage from './pages/User/MailValidationPage';

function isAuthenticated() {
  let token = localStorage.getItem('Token');
  if (token !== null) {
    let decodedToken = jwt_decode(token);
    let tokenExpTimestamp = decodedToken.exp;
    let nowTimestamp = Math.round((new Date()).getTime() / 1000);
    return (nowTimestamp < tokenExpTimestamp)
  }
  return false;
}

function hasInitialized() {
  let token = localStorage.getItem('Token');
  if (token !== null) {
    let decodedToken = jwt_decode(token);
    if (decodedToken.initializedProfile === "True") {
      return true;
    } else {
      return false;
    }
  }
}

function AuthRoute(props) {
  // Not signed in 
  if (!isAuthenticated()) {
    return <Navigate to="/signin" />
  }

  // Profile no initialized
  if (!hasInitialized()) {
    return <Navigate to="/newProfile" />
  }

  return props.children;
}

function NewProfileRoute(props) {
  // Profile already initialized
  if (hasInitialized()) {
    return <Navigate to="/" />
  }

  // Signed in and profile no initialized
  return props.children
}

function AuthEventGestion(props) {
  if (!rightIsInRole(props.myRights, "manage_events")) {
    return <Navigate to="/events" />
  }
  return props.children;
}

function AuthMembersGestion(props) {
  if (!rightIsInRole(props.myRights, "manage_members")) {
    return <Navigate to="/board" />
  }
  return props.children;
}

function RedirectToHome({ children }) {
  // Signed in
  if (isAuthenticated()) {
    return <Navigate to="/" />
  }

  // Not signed in 
  return children
}

function UpdateRightsBoard(props) {
  if (props.myRights.length === 0) {
    props.callback();
  }
  return props.children;
}

class MainRouter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      initializedProfile: false,
      myRights: []
    }
  }

  componentDidMount() {
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      e.preventDefault();
    }
    this.setState({ loaded: false })
    if (isAuthenticated()) {
      getMyRights().then((res) => {
        getInitializedProfileCurrentUser().then((resInitialized) => {
          this.setState({ myRights: res.myRights, initializedProfile: resInitialized.currentUser.initializedProfile, loaded: true });
        });
      })
    } else {
      this.setState({ loaded: true })
    }
  }

  updateRights() {
    if (isAuthenticated()) {
      getMyRights().then((res) => {
        this.setState({ myRights: res.myRights });
      })
    }
  }

  render() {
    return (
      this.state.loaded ? (
        <div>
          <BrowserRouter forceRefresh={false}>
            <Routes>
              <Route path='/signin' element={<RedirectToHome><LoginPage /></RedirectToHome>} />
                <Route exact path='/verify/:token' element={<MailValidationPage />} />
              <Route path='/newprofile' element={<NewProfileRoute><NewProfilePage /></NewProfileRoute>} />
              <Route path="/" element={<AuthRoute><App /></AuthRoute>}>
                <Route path='/membersGestion' element={<AuthMembersGestion myRights={this.state.myRights}><MembersAdministrationPage /></AuthMembersGestion>} />
                <Route path='/add/user' element={<AuthMembersGestion myRights={this.state.myRights}><AddMemberPage /></AuthMembersGestion>} />
                <Route path='/profileCompleted' element={<ProfileCompletedPage />} />
                <Route path="board" element={<UpdateRightsBoard callback={() => this.updateRights()} myRights={this.state.myRights}><BoardPage myRights={this.state.myRights} /></UpdateRightsBoard>} />
                <Route path='/myaccount' element={<MyAccountPage />} />
                <Route path='/events' element={<EventPage />} />
                <Route path='/eventsGestion' element={<AuthEventGestion myRights={this.state.myRights}><EventPageGestion /></AuthEventGestion>} />
                <Route path='/add/event' element={<AuthEventGestion myRights={this.state.myRights}><AddEventPage /></AuthEventGestion>} />
                <Route path='/eventDetails/:eventId' element={<EventDetailsPage admin={rightIsInRole(this.state.myRights, "manage_events")} />} />
                <Route path='/partitions' element={<ConstructionPage />} />
                <Route path='/allowance' element={<ConstructionPage />} />
                <Route path='/dressing' element={<ConstructionPage />} />
                <Route path='/claims' element={<ConstructionPage />} />
                <Route path='/membersGestion' element={<ConstructionPage />} />
                <Route path='/lockerGestion' element={<ConstructionPage />} />
                <Route path='/communicationGestion' element={<CommunicationPage />} />
                <Route path='/claimsGestion' element={<ConstructionPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter >
        </div>) : ""
    )
  }
}

export default MainRouter