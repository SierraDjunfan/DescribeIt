import { rooms } from ".";

export function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId = '';
    for (let i = 0; i < 6; i++) {
        roomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomId;
}

export function uniqueRoomCode() {

    let testRoomCode: string

    do {
        testRoomCode = generateRoomCode()
    } while (rooms.find(room => room.roomCode === testRoomCode))

    return testRoomCode
}

export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    return newArray.sort(() => Math.random() - 0.5);
  }

export function fillArrayWith1(to: number): number[] {
    return Array.from({ length: to }, (_, i) => i + 1);
  }