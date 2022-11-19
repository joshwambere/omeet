let app_id="95b2b4f4603a43a2842839ed6c175667";

let token = null;
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

const Url = window.location.search;
const urlParams = new URLSearchParams(Url);
const roomId = urlParams.get('room');
console.log(roomId)

if(!roomId){
    window.location.href = "lobby.html";
}

let localStream;
let remoteStream;
let peerConnection;
const server = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};
const constraints={
    video:{
        width:{
            min:640,
            ideal:1920,
            max:1920
        },
        height:{
            min:480,
            ideal:1080,
            max:1080
        }
    },
    audio:{
        echoCancellationType: 'system',
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate:24000,
        sampleSize:16,
        channelCount:2,
        volume:0.5
    },

}
const init = async () => {
    client = await AgoraRTM.createInstance(app_id);
    await client.login({uid, token});
    channel = client.createChannel(roomId);
    await channel.join()
    channel.on("MemberJoined", handleUserJoined);
    client.on('MessageFromPeer', handleMessageFromPeer);
    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    document.getElementById('user').srcObject = localStream;

}

const handleUserJoined = async (memberId)=>{
    await createOffer(memberId);
}

const handleMessageFromPeer = async(message, memberId)=>{
    const messageObj = JSON.parse(message.text);
    if(messageObj.type === "offer"){
        await createAnswer(memberId, messageObj.offer);
    }
    if(messageObj.type === "answer"){
        await addAnswer(messageObj.answer);
    }
    if(messageObj.type === "candidate"){
       if (peerConnection){
           await peerConnection.addIceCandidate(messageObj.candidate);
       }
    }
}
const createPeerConnection = async(memberId)=>{
    peerConnection = new RTCPeerConnection(server);
    remoteStream = new MediaStream();
    document.getElementById('user1').srcObject = remoteStream;
    document.getElementById('user1').style.display = "block";

    document.getElementById('user1').classList.add("small-frame");
    if (!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia({audio:true, video:true})
        document.getElementById('user').srcObject = localStream;
    }
    //add audio and video tracks to a offer given to the remote peer
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    peerConnection.ontrack = event => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track)); //adding local track to remote stream
    }
    peerConnection.onicecandidate = async (event)=>{
        if(event.candidate){
            client.sendMessageToPeer({text: JSON.stringify({'type': 'candidate', 'candidate':event.candidate})}, memberId);
        }
    }
}
// create offer for a remote peer
const createOffer= async(memberId)=>{
    await createPeerConnection(memberId);
    let offer = await peerConnection.createOffer()
    console.log(offer)
    await peerConnection.setLocalDescription(offer);
    client.sendMessageToPeer({text: JSON.stringify({'type': 'offer', offer})}, memberId);

}
const createAnswer = async(memberId,offer) =>{
    await createPeerConnection(memberId);
    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    client.sendMessageToPeer({text: JSON.stringify({'type': 'answer', 'answer':answer})}, memberId);

}

const addAnswer = async(answer)=>{
    if(!peerConnection.currentRemoteDescription){
        await peerConnection.setRemoteDescription(answer);
    }
}

const leaveChannel = async()=>{
    document.getElementById('user1').classList.remove("small-frame")
    await channel.leave();
    await client.logout();

}

const toggleCamera =()=>{
        const videoTrack = localStream.getTracks().find(track => track.kind === 'video');
        if(videoTrack){
            videoTrack.enabled = !videoTrack.enabled;
            document.getElementById('camera-btn').style.background = videoTrack.enabled ? '#3791f3' : '#ff0000';
        }
}
const toggleAudio =()=>{
    const audioTrack = localStream.getTracks().find(track => track.kind === 'audio')
    if (audioTrack){
        audioTrack.enabled = !audioTrack.enabled;
        document.getElementById('mic-btn').style.background = audioTrack.enabled ? '#3791f3' : '#ff0000';
    }

}

window.onbeforeunload = async ()=>{
    await leaveChannel();
}
document.getElementById('camera-btn').addEventListener('click', toggleCamera);
document.getElementById('mic-btn').addEventListener('click', toggleAudio);


init()
