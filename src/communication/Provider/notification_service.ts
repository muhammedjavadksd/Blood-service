// import * as  amqplib from 'amqplib'
import * as amqplib from 'amqplib';
import { BloodGroup } from '../../Util/Types/Enum';


interface IBloodNotificationProvider {
    bloodRequestMailer(blood_group: BloodGroup, location: string, deadLine: string, full_n)
}


class BloodNotificationProvider implements IBloodNotificationProvider {

    private connection: amqplib.Connection | null = null;
    private channel: amqplib.Channel | null = null
    private readonly NOTIFICATION_QUEUE: string;
    // process.env.USER_SIGN_IN_NOTIFICATION as string;


    constructor(queue: string) {
        this.NOTIFICATION_QUEUE = queue;
    }

    async _init_() {
        this.connection = await amqplib.connect("amqp://localhost");
        this.channel = await this.connection.createChannel();
    }
}


export default BloodNotificationProvider;

