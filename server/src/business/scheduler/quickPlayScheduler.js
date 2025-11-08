const roomService = require('../service/roomService')

class QuickPlayScheduler {

    constructor(io) {
        this.io = io 
        this.isRunning = false;
        this.matchingCount = 0;
        this.lastRunTime = 0;
    }

    start() {
        if(this.isRunning) return;

        this.isRunning = true;
        console.log('Quick play scheduler started');
        this.runMathcingCycle();
    }

    stop() {
        if(!this.isRunning) return;
        this.isRunning = false;
        console.log('Quick play scheduler stopped');
    }

    async runMathcingCycle() {
        console.log('continueing the cycle')
        try {
            let startTime = Date.now();
            
            // await function fetch;
            const room = await roomService.tryQuickPlay(); 

            if(room) {
                // console.log(room)
                if(this.io) {
                    console.log('room new found', room.players?.map(p => p.user))
                    room.players.forEach( p => {
                        this.io.to(p.socketId?.toString()).emit("room-found",{type: room.type, roomId: room.roomId})
                    })
                } 
            }

            const processingTime = Date.now() - startTime;
            this.lastRunTime = processingTime;
            this.matchingCount++;

            if(this.matchingCount % 10 === 0)  {
                console.log(`📊 Quick Play Stats - Cycles: ${this.matchingCount}, Last Run: ${processingTime}ms`);
            }

            if(processingTime > 1000) {
                console.warn(`🚨 Quick Play Cycle Warning - Processing time exceeded 1000ms: ${processingTime}ms`);
            }

            
        }
        catch(error) {
            console.error('Error: ', error);
            this.stop();
            throw error;
        }
        finally {
            if(this.isRunning) {
                setTimeout(() => this.runMathcingCycle(), 8000);
            }
        }
    }
} 

module.exports = QuickPlayScheduler