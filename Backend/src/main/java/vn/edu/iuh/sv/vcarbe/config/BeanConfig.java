/**
 * @Author HuyVu
 * @CreatedDate 2/24/2023 1:41 PM
 */
package vn.edu.iuh.sv.vcarbe.config;

import io.socket.engineio.server.EngineIoServer;
import io.socket.engineio.server.EngineIoServerOptions;
import io.socket.socketio.server.SocketIoServer;
import io.socket.socketio.server.SocketIoSocket;
import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.edu.iuh.sv.vcarbe.util.JsonUtils;

@Configuration
public class BeanConfig {

    @Bean
    EngineIoServer engineIoServer() {
        var opt = EngineIoServerOptions.newFromDefault();
        opt.setCorsHandlingDisabled(true);
        var eioServer = new EngineIoServer(opt);
        return eioServer;
    }

    @Bean
    SocketIoServer socketIoServer(EngineIoServer eioServer) {
        var sioServer = new SocketIoServer(eioServer);

        var namespace = sioServer.namespace("/ws");

        namespace.on("connection", args -> {
            var socket = (SocketIoSocket) args[0];
            System.out.println("Client " + socket.getId() + " (" + socket.getInitialHeaders().get("remote_addr") + ") has connected.");

            socket.on("joinRoom", args1 -> {
                String room = (String) args1[0];
                socket.joinRoom(room);
                System.out.println("Client " + socket.getId() + " joined room " + room);
            });

            socket.on("message", args1 -> {

                JSONObject o = (JSONObject) args1[0];
                var messageVo = JsonUtils.toPojoObj(o, MessageVo.class);
                String room = (String) args1[1];


//                System.out.println("[Client " + socket.getId() + "] " + messageVo);
                socket.broadcast(room, "message", JsonUtils.toJsonObj(messageVo));
                socket.send("hello", JsonUtils.toJsonObj(messageVo));
            });
        });

        return sioServer;
    }

    record MessageVo(
            String author,
            String msg) {

    }

}

