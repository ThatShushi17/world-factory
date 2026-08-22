#version 300 es

in vec2 a_position;
in vec3 a_color;

uniform float u_angle;

out vec3 v_color;

void main() {
    float c = cos(u_angle);
    float s = sin(u_angle);

    mat2 rotation = mat2(
        c, -s,
        s,  c
    );

    gl_Position = vec4(rotation * a_position, 0.0, 1.0);

    v_color = a_color;
}