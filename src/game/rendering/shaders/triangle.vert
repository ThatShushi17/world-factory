#version 300 es

in vec2 a_position;
in vec3 a_color;

uniform float u_angle;

uniform vec2 u_camera_position;
uniform float u_camera_zoom;
uniform vec2 u_viewport_size;

out vec3 v_color;

void main() {
    vec2 screen_position =
        (a_position - u_camera_position)
        * u_camera_zoom
        + u_viewport_size * 0.5;

    vec2 clip_position =
        (screen_position / u_viewport_size) * 2.0 - 1.0;

    clip_position.y = -clip_position.y;  // FIXME: is it necessary?

    float c = cos(u_angle);
    float s = sin(u_angle);

    mat2 rotation = mat2(
        c, -s,
        s,  c
    );

    gl_Position = vec4(rotation * clip_position, 0.0, 1.0);

    v_color = a_color;
}
