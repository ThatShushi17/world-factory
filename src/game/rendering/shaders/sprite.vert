#version 300 es

in vec2 a_position;
in vec2 a_uv;

uniform vec2 u_position;
uniform vec2 u_size;

uniform vec2 u_camera_position;
uniform float u_camera_zoom;
uniform vec2 u_viewport_size;

out vec2 v_uv;

void main() {
    vec2 world_position =
        u_position + a_position * u_size;

    vec2 screen_position =
        (world_position - u_camera_position)
        * u_camera_zoom
        + u_viewport_size * 0.5;

    vec2 clip_position =
        (screen_position / u_viewport_size) * 2.0 - 1.0;
    
    clip_position.y = -clip_position.y;

    gl_Position = vec4(clip_position, 0.0, 1.0);

    v_uv = a_uv;
}