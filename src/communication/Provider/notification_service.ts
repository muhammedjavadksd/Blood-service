// import * as  amqplib from 'amqplib'
import * as amqplib from 'amqplib';
import { BloodGroup } from '../../Util/Types/Enum';


interface IBloodNotificationProvider {
    // bloodRequestMailer(blood_group: BloodGroup, location: string, deadLine: string, full_n)
}


class BloodNotificationProvider implements IBloodNotificationProvider {

    private connection: amqplib.Connection | null = null;
    private channel: amqplib.Channel | null = null
    private readonly NOTIFICATION_QUEUE: string;


    constructor(queue: string) {
        this.NOTIFICATION_QUEUE = queue;
    }


    async transferData(data: Record<string, any>) {
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
            console.log("Profile sending to emails");

            console.log(data);

            this.channel?.sendToQueue(this.NOTIFICATION_QUEUE, Buffer.from(JSON.stringify(data)))
            return true
        } catch (e) {
            console.log(e);
            return false
        }
    }

    async _init_() {
        this.connection = await amqplib.connect(process.env.RABBITMQ_URL || "");
        this.channel = await this.connection.createChannel();
    }
}


export default BloodNotificationProvider;

