// import * as  amqplib from 'amqplib'
import * as amqplib from 'amqplib';
import { BloodGroup } from '../../Util/Types/Enum';


interface IBloodNotificationProvider {
    transferData(data: Record<string, any>): Promise<boolean>
    sendBloodRequest(emails: any, blood_group: BloodGroup, dead_line: Date, location: string): boolean
    _init_(): Promise<void>
}


class BloodNotificationProvider implements IBloodNotificationProvider {

    private connection: amqplib.Connection | null = null;
    private channel: amqplib.Channel | null = null
    private readonly NOTIFICATION_QUEUE: string;


    constructor(queue: string) {
        this.NOTIFICATION_QUEUE = queue;
    }


    async transferData(data: Record<string, any>): Promise<boolean> {
        try {
            await this.channel?.sendToQueue(this.NOTIFICATION_QUEUE, Buffer.from(JSON.stringify(data)))
            return true
        } catch (e) {
            return false
        }
    }

    sendBloodRequest(emails: any, blood_group: BloodGroup, dead_line: Date, location: string): boolean {


        try {
            let data = {
                recipients: emails,
                blood_group: blood_group,
                deadLine: dead_line,
                location: location
            }
            this.channel?.sendToQueue(this.NOTIFICATION_QUEUE, Buffer.from(JSON.stringify(data)))
            return true
        } catch (e) {
            console.log(e);
            return false
        }
    }

    async _init_(): Promise<void> {
        this.connection = await amqplib.connect(process.env.RABBITMQ_URL || "");
        this.channel = await this.connection.createChannel();
    }
}


export default BloodNotificationProvider;

