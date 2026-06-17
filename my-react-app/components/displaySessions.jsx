export default function DisplaySessions({session}){
    
    let username = localStorage.getItem("username");
    let game = localStorage.getItem("gameName");

    return (
    <>
    {/*console.log(session.status)*/}
    <div  className="sessionLetter">
        <span >
        <span>Match ID: {session.id}</span><br/>
        <span>Created by: {username}</span><br/>
        <span>Game: {game}</span><br/>
        <span>Started: {session.start_time}</span><br/>
        <span>Duration: {session.duration} minutes</span><br/>
        <span>Description: {session.description}</span><br/>
        <span>Connection: {session.connection_type}</span><br/>
        <span>Status: {session.status}</span><br/>
        <span>Created: {session.created_at}</span>
        </span>
    </div>
    </>);
}