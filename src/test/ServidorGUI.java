import java.io.*;
import java.net.*;
import java.util.*;
import javax.swing.*;
import java.awt.*;

public class ServidorGUI {
    private static final int PORT = 12345;
    private static Set<PrintWriter> clientWriters = new HashSet<>();
    private JFrame frame;
    private JTextArea logArea;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new ServidorGUI().start());
    }

    public void start() {
        frame = new JFrame("Servidor de Chatbot - Reservas");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);

        logArea = new JTextArea();
        logArea.setEditable(false);
        frame.add(new JScrollPane(logArea), BorderLayout.CENTER);

        frame.setVisible(true);

        startServer();
    }

    private void startServer() {
        logArea.append("Servidor iniciado...\n");
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            while (true) {
                new ClientHandler(serverSocket.accept()).start();
            }
        } catch (IOException e) {
            logArea.append("Error en el servidor: " + e.getMessage() + "\n");
        }
    }

    private class ClientHandler extends Thread {
        private Socket socket;
        private PrintWriter out;

        public ClientHandler(Socket socket) {
            this.socket = socket;
        }

        public void run() {
            try {
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                out = new PrintWriter(socket.getOutputStream(), true);

                synchronized (clientWriters) {
                    clientWriters.add(out);
                }

                logArea.append("Nuevo cliente conectado.\n");

                String message;
                while ((message = in.readLine()) != null) {
                    logArea.append("Mensaje recibido: " + message + "\n");

                    // Chatbot de reservas
                    if (message.contains("/reserva")) {
                        out.println("🤖 Bienvenido al sistema de reservas.");
                        out.println("🤖 Dime en qué sede deseas reservar: (1) Plazuela de Virrey (2) Villas de Granada");
                    } else if (message.contains("1")) {
                        out.println("🤖 Excelente, sede Plazuela de Virrey seleccionada.");
                        out.println("🤖 ¿Para cuántas personas es la reserva?");
                    } else if (message.contains("2")) {
                        out.println("🤖 Perfecto, sede Villas de Granada seleccionada.");
                        out.println("🤖 ¿Para cuántas personas es la reserva?");
                    } else if (message.matches(".*\\d+.*")) {
                        out.println("🤖 Reserva registrada para " + message.replaceAll("\\D", "") + " personas ✅.");
                        out.println("🤖 Gracias por reservar. Te esperamos 🍔🔥");
                    } else {
                        broadcast(message);
                    }
                }
            } catch (IOException e) {
                logArea.append("Error con el cliente: " + e.getMessage() + "\n");
            } finally {
                if (out != null) {
                    synchronized (clientWriters) {
                        clientWriters.remove(out);
                    }
                }
                try {
                    socket.close();
                    logArea.append("Cliente desconectado.\n");
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        private void broadcast(String message) {
            synchronized (clientWriters) {
                for (PrintWriter writer : clientWriters) {
                    writer.println(message);
                }
            }
        }
    }
}
