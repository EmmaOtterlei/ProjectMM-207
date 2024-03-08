class SessionManager {
  constructor() {
      this.sessions = {};
  }

  createSession(user_id) {
      const session_id = this.generateSessionId();
      this.sessions[session_id] = { user_id, current_question: 0 };
      return session_id;
  }

  validateSession(session_id) {
      return this.sessions[session_id];
  }

  destroySession(session_id) {
      if (session_id in this.sessions) {
          delete this.sessions[session_id];
      }
  }

  generateSessionId() {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let sessionId = '';
      for (let i = 0; i < 16; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          sessionId += chars.charAt(randomIndex);
      }
      return sessionId;
  }
}

class StateTracker {
  trackProgress(session_id, quiz_state) {
      if (session_id in sessionManager.sessions) {
          sessionManager.sessions[session_id].current_question = quiz_state.current_question;
      }
  }
}

class DataStorage {
  constructor() {
      this.data = {};
  }

  storeData(session_id, key, value) {
      if (!(session_id in this.data)) {
          this.data[session_id] = {};
      }
      this.data[session_id][key] = value;
  }

  retrieveData(session_id, key) {
      return this.data[session_id]?.[key] || null;
  }
}

export { SessionManager, StateTracker, DataStorage };
