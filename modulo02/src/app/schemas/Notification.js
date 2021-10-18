import mongoose from 'mongoose';
// notificar toda vez que um agendamento for marcado
const NotificationSchema = new mongoose.Schema(
  {
    // saber quais dados estarão lá dentro, o conteudo = content
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
