import './App.css';
import React from 'react';
import publicIp from "public-ip";
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import sha1 from "sha1";

//If youre reading this.... go away
//:)
var ip = "http://3.93.236.94";
async function getIP() {
  return await publicIp.v4();
}
const fpPromise = FingerprintJS.load()

async function addClick(hashedIP, fingerprint, uname) {
  // Simple POST request with a JSON body using fetch
  if (uname == "") {
    uname = "Mr Beast";
  }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ip: hashedIP,
      fingerprint: fingerprint,
      name: uname,
    })
  };
  fetch(ip + "/countClick", requestOptions)
    .then(response => response.json())
    .then(data => console.log(data));
}

class Page extends React.Component {

  //IP will get hashed before sent online to protect privacy
  constructor(props) {
    super(props);

    this.state = {
      totalClicks: null,
      leaderboard: null,
      fingerprint: null,
      ip: null,
      inputValue: 'Mr Beast'
    };
    this.getClicks = this.getClicks.bind(this);
    this.getLeaderboard = this.getLeaderboard.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  getClicks() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(ip + "/getClicks", requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({ totalClicks: data.numClicks })
        console.log(data)
      });
  }
  getLeaderboard() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(ip + "/getLeaderboard", requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({ leaderboard: data })
        console.log(data)
      });
  }
  async componentDidMount() {
    // GET request using fetch with async/await

    this.getClicks();
    this.getLeaderboard();
    this.setState({ ip: sha1(await getIP()) })

    var data1 = await fpPromise;
    var data2 = await data1.get();
    var visitorID = data2.visitorId;
    this.setState({ fingerprint: visitorID })
  }
  onClick(event) {
    addClick(this.state.ip, this.state.fingerprint, this.state.inputValue)
      .then(this.getClicks());
  }
  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  render() {
    const { totalClicks, leaderboard } = this.state;
    //<button onClick={this.onClick} className="button"> Total Amount Donated: ${totalClicks / 10000}</button>

    return (
      <div className="App">
        <div className="Header">
          <h2>Team Seas Clicker </h2>
          <h5><small className="text-muted">
            Every click of the button, I will donate $0.0001 to Team Seas
          </small></h5>
          <hr />
        </div>
        <div>

          <button onClick={this.onClick} className="button">
            <div >
              <input onChange={evt => this.updateInputValue(evt)} value={this.state.inputValue} style={{ marginRight: 50 + "px" }} type="text" className='Name' ></input>
              Total Amount Donated: ${totalClicks / 10000}
            </div>
          </button>
        </div >
        <table>
          <tbody>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Points</th>
            </tr>
            {leaderboard != null ?
              leaderboard.map((listValue, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td style={{ textTransform: 'capitalize' }}>{listValue[0]}</td>
                    <td style={{ textTransform: 'capitalize' }}>{listValue[1]}</td>
                  </tr>
                );
              }) : <tr>
                <td>"Loading..."</td>
                <td>"Loading..."</td>
                <td>"Loading..."</td>
              </tr>}
          </tbody>
        </table>
      </div >
    );
  }
}


export default Page;
