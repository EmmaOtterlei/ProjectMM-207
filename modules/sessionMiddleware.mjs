class SessionManager {
    constructor() {
        this.sessions = {};
    }
  
    createSession(userId) {
        const sessionId = this.generateSessionId();
        this.sessions[sessionId] = { userId, currentQuestion: 0 };
        return sessionId;
    }
  
    validateSession(sessionId) {
        return this.sessions[sessionId];
    }
  
    destroySession(sessionId) {
        delete this.sessions[sessionId];
    }
  
    generateSessionId() {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let sessionId = '';
        for (let i = 0; i < 16; i++) {
            sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return sessionId;
    }
  }
  
  class StateTracker {
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
    }
  
    trackProgress(sessionId, quizState) {
        if (sessionId in this.sessionManager.sessions) {
            this.sessionManager.sessions[sessionId].currentQuestion = quizState.currentQuestion;
        }
    }
  }
  
  class DataStorage {
    constructor() {
        this.data = {};
    }
  
    storeData(sessionId, key, value) {
        if (!(sessionId in this.data)) {
            this.data[sessionId] = {};
        }
        this.data[sessionId][key] = value;
    }
  
    retrieveData(sessionId, key) {
        return this.data[sessionId]?.[key] || null;
    }
  }
  
  export { SessionManager, StateTracker, DataStorage };
  