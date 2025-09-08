import java.io.*;
import java.net.*;
import javax.swing.*;
import java.awt.*;

public class ClienteGUI {
    private static final String SERVER_ADDRESS = "localhost";
    private static final int SERVER_PORT = 12345;
    private Socket socket;
    private PrintWriter out;
    private BufferedReader in;

    private JFrame frame;
    private JTextArea chatArea;
    private JTextField inputField;
    private JButton sendButton;
    private JButton chatbotButton;
    private String username;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new ClienteGUI().start());
    }

    public void start() {
        frame = new JFrame("Cliente ChatBot - Reservas");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(500, 400);
        frame.setMinimumSize(new Dimension(500, 400));
        frame.setLayout(new BorderLayout());

        chatArea = new JTextArea();
        chatArea.setEditable(false);
        chatArea.setFont(new Font("Arial", Font.PLAIN, 14));
        chatArea.setLineWrap(true);
        chatArea.setWrapStyleWord(true);

        JScrollPane chatScrollPane = new JScrollPane(chatArea);
        frame.add(chatScrollPane, BorderLayout.CENTER);

        JPanel inputPanel = new JPanel(new BorderLayout());
        inputField = new JTextField();
        inputField.setFont(new Font("Arial", Font.PLAIN, 14));
        inputPanel.add(inputField, BorderLayout.CENTER);

        sendButton = new JButton("Enviar");
        sendButton.setBackground(new Color(60, 179, 113));
        sendButton.setForeground(Color.WHITE);
        sendButton.addActionListener(e -> sendMessage());
        inputPanel.add(sendButton, BorderLayout.EAST);

        chatbotButton = new JButton("Chatbot Reservas");
        chatbotButton.setBackground(new Color(255, 140, 0));
        chatbotButton.setForeground(Color.WHITE);
        chatbotButton.addActionListener(e -> startChatbot());
        inputPanel.add(chatbotButton, BorderLayout.WEST);

        frame.add(inputPanel, BorderLayout.SOUTH);

        frame.setVisible(true);

        connectToServer();
    }

    private void connectToServer() {
        try {
            socket = new Socket(SERVER_ADDRESS, SERVER_PORT);
            out = new PrintWriter(socket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            chatArea.append("🤖 Conectado al servidor de reservas.\n");

            username = JOptionPane.showInputDialog(frame, "Ingrese su nombre de usuario:", "Bienvenido", JOptionPane.PLAIN_MESSAGE);
            if (username == null || username.trim().isEmpty()) {
                username = "Cliente";
            }

            new Thread(new IncomingReader()).start();
        } catch (IOException e) {
            chatArea.append("No se pudo conectar al servidor.\n");
            e.printStackTrace();
        }
    }

    private void sendMessage() {
        String message = inputField.getText().trim();
        if (!message.isEmpty()) {
            out.println(username + ": " + message);
            inputField.setText("");
        }
    }

    private void startChatbot() {
        out.println(username + ": /reserva");
    }

    private class IncomingReader implements Runnable {
        public void run() {
            String message;
            try {
                while ((message = in.readLine()) != null) {
                    chatArea.append(message + "\n");
                    chatArea.setCaretPosition(chatArea.getDocument().getLength());
                }
            } catch (IOException e) {
                chatArea.append("Conexión cerrada.\n");
            }
        }
    }
}
